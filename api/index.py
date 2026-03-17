import sys
import os

# Add backend to path so we can import main
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app
from mangum import Mangum

handler = Mangum(app, lifespan="off")
