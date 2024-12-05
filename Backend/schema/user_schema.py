from pydantic import BaseModel
from typing import Optional

class UserSchema(BaseModel):
    id_usuario: int | None = None 
    nombre:str
    apellido:str
    email:str
    contraseña:str
    direccion:str
    telefono:str