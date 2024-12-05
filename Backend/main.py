from fastapi import FastAPI, HTTPException, Request, Response, status, Form
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT
from schema.user_schema import UserSchema
from config.db import engine
from model.userss import users
from typing import List
from fastapi.middleware.cors import CORSMiddleware

user = FastAPI()
origin = [
    "http://localhost:4000"
]

user.add_middleware (
    CORSMiddleware,
    allow_origins= ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@user.get("/api/user")
def get_users():
    with engine.connect() as conn:
        result = conn.execute(users.select()).fetchall()

        # Obtener los nombres de las columnas
        columns = users.columns.keys()

        # Convertir el resultado a una lista de diccionarios
        user_list = [dict(zip(columns, row)) for row in result]

        return user_list
    

#@user.post("/api/user3", status_code=HTTP_201_CREATED)
#async def create_user1(data_user: Request):
#    return await data_user.json()

@user.post("/api/user", status_code=HTTP_201_CREATED)
def create_user(data_user: UserSchema):
    with engine.connect() as conn:
        new_user = data_user.dict()

        conn.execute(users.insert().values(new_user))
        conn.commit()

        return Response(status_code=HTTP_201_CREATED)

#@user.post("/api/user2", status_code=HTTP_201_CREATED)
#def create_user2(data_user: UserSchema):
#        return Response(status_code=HTTP_201_CREATED)

@user.get("/api/user/{id}", response_model=UserSchema)
def get_user(id: int):
    with engine.connect() as conn:
        return conn.execute(users.select().where(users.c.id_usuario== id)).first()




@user.delete("/api/user/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(id: int):
    with engine.connect() as conn:
       
        existing_user = conn.execute(users.select().where(users.c.id_usuario == id)).first()

        if not existing_user:
            return Response(status_code=status.HTTP_404_NOT_FOUND, content="Usuario no encontrado")

        
        conn.execute(users.delete().where(users.c.id_usuario == id))
        conn.commit()  

        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    
@user.put("/api/user/{id}", response_model=UserSchema)
def update_user(id: int, data_user: UserSchema):
    with engine.connect() as conn:
      
        existing_user = conn.execute(users.select().where(users.c.id_usuario == id)).first()
        
        if not existing_user:
            return Response(status_code=404, content="Usuario no encontrado")

        
        updated_data = data_user.dict()

        
        conn.execute(
            users.update()
            .where(users.c.id_usuario == id)
            .values(updated_data)
        )
        conn.commit()

        
        updated_user = conn.execute(users.select().where(users.c.id_usuario == id)).first()

        return updated_user
    