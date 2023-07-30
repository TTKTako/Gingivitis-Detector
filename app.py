# import torch

# model = torch.hub.load("ultralytics/yolov5", "custom", "bestgingi66datasets_wattribute.pt")

# im = "./620-1-hlight_default.jpg"

# result = model(im)
# result.show()
# result.save(save_dir="./result",exist_ok=True)

# print(result.pandas().xyxy[0])

import torch
import base64
import json
model = torch.hub.load("ultralytics/yolov5", "custom", "best.pt")
from flask import Flask, request, jsonify


app = Flask(__name__)

@app.route("/detect", methods=["POST"])
def detect():
    b64 = request.json["b64"]
    fileName = request.json["fileName"]

    with open("./image/" + fileName, "wb") as fh:
        fh.write(base64.decodebytes(b64.encode()))

    result = model("./image/" + fileName)
    result.save(save_dir="./result",exist_ok=True)

    with open("./result/"+ fileName, "rb") as f:
        encoded_image = base64.b64encode(f.read())

    jsonRes = result.pandas().xyxy[0].to_json(orient = "records")
    load = json.loads(jsonRes)

    return jsonify({"message": str(encoded_image), "res":load})