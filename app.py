from flask import Flask, render_template
from flask_socketio import SocketIO

import json
import time
import serial
from threading import Thread
from radio import Parser
from datetime import datetime
from serial.tools.list_ports import comports
import os

app = Flask(__name__)
socketio = SocketIO(app)
parser = Parser() # parser class to go from bytes to JSON

SERIAL_PORT_FILL_RADIO = "COM4"
SERIAL_PORT_AV_RADIO    = "COM5"

FILL_RADIO_BAUD = 57600
AV_RADIO_BAUD = FILL_RADIO_BAUD

fill_radio_serial_handle = None
av_radio_serial_handle    = None

current_data_handle = {
        "millis": 0,
        "alt": 0,
        "vel": 0,
        "acc": 0,
        "raw_alt": 0,
        "raw_acc": 0,
        "lat": 0,
        "lon": 0,
        "apogee": 0,
        "temp": 0,
        "pressure": 0,
        "phase": 0,
        "ang_vel_vector": 0,
        "vref": 0,
        "ft_v1": -1,
        "ft_v2": -1,
        "ft_lc_adc": -1,
        "ft_pt_adc": -1,
        "status": "Offline"
}

def connect_fill_radio():
    print(f"Connecting to fill board radio on port {SERIAL_PORT_FILL_RADIO}")
    try:
        global fill_radio_serial_handle 
        fill_radio_serial_handle = serial.Serial(SERIAL_PORT_FILL_RADIO, baudrate=FILL_RADIO_BAUD)
        return True
    except:
        print("Could not connect to fill radio, check available serial ports.")
        return False

def connect_av_radio():
    print(f"Connecting to avionics radio on port {SERIAL_PORT_AV_RADIO}")
    try:
        global av_radio_serial_handle 
        av_radio_serial_handle = serial.Serial(SERIAL_PORT_AV_RADIO, baudrate=AV_RADIO_BAUD)
        current_data_handle["status"] = "Online"
        return True
    except:
        print("Could not connect to avionics radio, check available serial ports.")
        return False

def create_log_filename(deviceName):
    filename = datetime.now().strftime("%Y%m%dT%H%M%S.log")
    return os.path.join('logs/' + filename + "-" + deviceName)

FILL_RADIO_PACKET_LEN = 8
def read_thread_fill_radio(): #0x02 | adc1 (2) | adc2 (2) | 0x00 | 0x00| \n
    with open(create_log_filename("fill"), "a",encoding="utf-8") as log_file:
        while True:
            buf = fill_radio_serial_handle.readline()
            if len(buf) < 8: continue
            if buf[0] != 0x02: print("Invalid header from fill radio")
            #print(buf[1:].decode("utf-8")) # Just dump what we get from fill radio
            data_bytes = buf[1:] # 6 bytes of data + nl

            adc1 = data_bytes[0] << 8 | data_bytes[1]
            adc2  = data_bytes[2] << 8 | data_bytes[3]

            print("\n==== FILL BOARD TELEMETRY ====")
            print("ADC1: " + str(adc1))
            print("ADC2: "  + str(adc2))           
            print("==== END ====\n") #newline

            current_data_handle["ft_lc_adc"] = adc1

AV_RADIO_PACKET_LEN = 8
def read_thread_av_radio(): # 0x01 | adc (2) | v1 (2) | v2(2) | \n
    with open(create_log_filename("avionics"), "a", encoding="utf-8") as log_file:
        while True:
            buf = av_radio_serial_handle.readline() # Read up until the newline character
            if len(buf) < 8: continue
            if buf[0] != 0x01: print("Invalid header from avionics radio")
            data_bytes = buf[1:] # 6 bytes of data + nl

            # txData[0] = (raw >> 8) & 0xFF;       MSB of adc
            # txData[1] = raw & 0xFF;              LSB of adc
            # txData[2] = (voltage0 >> 8) & 0xFF;  MSB of v1
            # txData[3] = voltage0 & 0xFF;         LSB of v1
            # txData[4] = (voltage1 >> 8) & 0xFF;  MSB of v2
            # txData[5] = voltage1 & 0xFF;         LSB of v2

            adc = data_bytes[0] << 8 | data_bytes[1]
            v1  = data_bytes[2] << 8 | data_bytes[3]
            v2  = data_bytes[4] << 8 | data_bytes[5]

            print("\n==== AVIONICS TELEMETRY ====")
            print("ADC: " + str(adc))
            print("V1: "  + str(v1))           
            print("V2: "  + str(v2))           
            print("==== END ====\n") #newline

            current_data_handle["ft_v1"] = v1
            current_data_handle["ft_v2"] = v2
            current_data_handle["ft_pt_adc"] = adc

def socket_data_thread():
    while True:
        socketio.emit("data",current_data_handle)
        time.sleep(0.20) # Send updates at 5 HZ 

def send_fill_board_command(data):
    print("Sending fill board command: ")
    if fill_radio_serial_handle == None:
        print("No connection to fill board radio.")
    else:
        fill_radio_serial_handle.write(data)

def send_av_command(data):
    print("Sending avionics command: ")
    if av_radio_serial_handle == None:
        print("No connection to avionics radio.")
    else:
        av_radio_serial_handle.write(data)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    if av_radio_serial_handle == None:
        if connect_av_radio():   
            Thread(target=read_thread_av_radio).start()
        else:
            print("No avionics radio detected.")

    if fill_radio_serial_handle == None:
        if connect_fill_radio(): 
            Thread(target=read_thread_fill_radio).start()
        else:
            print("No fill board radio detected.")

    Thread(target=socket_data_thread).start()

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('RF-Fill')
def rfPacket(packet):
    print("Fill board command: " + str(packet))
    send_fill_board_command(packet.encode("utf-8"))

@socketio.on('RF-Av')
def rfPacket(packet):
    print("Av bay command: " + str(packet))
    send_av_command(packet.encode("utf-8"))

# function sendRFFillPacket(packet) {
#   socket.emit('RF-Fill', packet);
# }

# function sendRFAvPacket(packet) {
#   socket.emit("RF-Av",packet);
# }

if __name__ == '__main__':
    socketio.run(app, debug=True)