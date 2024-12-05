from sqlalchemy import DATE, DECIMAL, Table,Column,ForeignKey
from sqlalchemy.sql.sqltypes import Integer,String
from config.db import engine, meta_data

users=Table("usuario", meta_data,
             Column("id_usuario", Integer, primary_key=True),
             Column("nombre",String(50), nullable=False),
             Column("apellido", String(50), nullable=False),
             Column("email", String(100), nullable=False),
             Column("contraseña", String(255), nullable=False),
             Column("direccion", String(255), nullable=False),
             Column("telefono", String(15),nullable=False))

facture=Table("factura", meta_data,
              Column("id_factura", Integer, primary_key=True),
              Column("id_usuario", Integer, ForeignKey("usuario.id_usuario")),
              Column("fecha_factura", DATE, nullable=True),
              Column("total", DECIMAL(10, 2), nullable=True),
              Column("metodo_pago", String(50), nullable=True))


meta_data.create_all(engine)