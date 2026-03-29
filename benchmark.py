import time
import requests

# Your server
LOCAL_SERVER = "http://10.52.86.9:8000/backup"

# Example external (simulate)
GOOGLE_DRIVE_API = "https://httpbin.org/post"

file_path = "testfile.enc"

def test_server(url):
    with open(file_path, "rb") as f:
        files = {"file": f}
        data = {"pin": "1234", "device_id": "phoneA"}

        start = time.time()
        requests.post(url, files=files, data=data)
        end = time.time()

        return end - start

local_time = test_server(LOCAL_SERVER)
cloud_time = test_server(GOOGLE_DRIVE_API)

print("Local Server Time:", local_time)
print("Cloud Time:", cloud_time)
