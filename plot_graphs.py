import matplotlib.pyplot as plt

# =========================
# DATA (You can modify)
# =========================

# File size in KB
file_sizes = [100, 500, 1000, 2000, 5000]

# Upload time in seconds (measure from your backend logs)
upload_time = [0.2, 0.5, 0.9, 1.5, 3.0]

# Latency in ms
latency = [50, 70, 100, 150, 250]

# Throughput KB/sec
throughput = [500, 1000, 1100, 1300, 1600]

# =========================
# GRAPH 1: File Size vs Upload Time
# =========================
plt.figure()
plt.plot(file_sizes, upload_time, marker='o')
plt.xlabel("File Size (KB)")
plt.ylabel("Upload Time (sec)")
plt.title("File Size vs Upload Time")
plt.grid()
plt.savefig("graph_upload_time.png")

# =========================
# GRAPH 2: File Size vs Latency
# =========================
plt.figure()
plt.plot(file_sizes, latency, marker='o')
plt.xlabel("File Size (KB)")
plt.ylabel("Latency (ms)")
plt.title("File Size vs Latency")
plt.grid()
plt.savefig("graph_latency.png")

# =========================
# GRAPH 3: File Size vs Throughput
# =========================
plt.figure()
plt.plot(file_sizes, throughput, marker='o')
plt.xlabel("File Size (KB)")
plt.ylabel("Throughput (KB/sec)")
plt.title("File Size vs Throughput")
plt.grid()
plt.savefig("graph_throughput.png")

print("Graphs generated successfully!")
