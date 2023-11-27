import tensorflow as tf
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import numpy as np
import io
from PIL import Image
import uvicorn
import requests

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:63342"],  # Change this to the specific origin(s) of your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

endpoint = "http://localhost:8501/v1/models/tomato_models:predict"


CLASSES = ['Bacterial Spot',
            'Early Blight',
            'Late Blight',
            'Leaf Mold',
           'Septoria Leaf Spot',
           'Two Spotted Spider Mite',
           'Target Spot',
           'Tomato Yellow Leaf Curl Virus',
           'Tomato Mosaic Virus',
           'Healthy']


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    file_bytes = await file.read()

    # Convert the bytes to a PIL Image object
    image = np.array(Image.open(io.BytesIO(file_bytes)))
    image_batched = np.expand_dims(image, axis=0)
    json_data = {
        "instances":image_batched.tolist()
    }
    response = requests.post(endpoint, json=json_data)
    prediction_batched = response.json()["predictions"]
    prediction = CLASSES[np.argmax(prediction_batched[0])]
    confidence = round(100 * (np.max(prediction_batched[0])), 2)
    return {"message": prediction, "confidence": confidence}


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    uvicorn.run(app, host='localhost', port=8000)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
