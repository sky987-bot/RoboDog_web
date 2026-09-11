from fastapi import FastAPI

from routes import auth


app = FastAPI()


# Authentication routes
app.include_router(auth.router)


@app.get("/")
def home():
    return {
        "message": "RoboDog Backend is Running"
    }