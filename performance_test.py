import requests
import time

SERVER_URL = "http://10.52.86.9:8000/backup"

file_path = "testfile.enc"

def measure_performance():
    with open(file_path, "rb") as f:
        files = {"files": f}
        data = {"pin": "1234", "device_id": "phoneA"}

        start = time.time()
        response = requests.post(SERVER_URL, files=files, data=data)
        end = time.time()

        response_time = end - start
        file_size = len(open(file_path, "rb").read())

        throughput = file_size / response_time

        print("Response Time:", response_time, "sec")
        print("Throughput:", throughput, "bytes/sec")

measure_performance()
