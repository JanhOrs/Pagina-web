document.getElementById("registro").addEventListener("submit",async(e)=>{
    e.preventDefault();
    console.log(e.target.children.nombre.value)
    const res = await fetch("http://127.0.0.1:3500/api/user", {
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            nombre: e.target.children.nombre.value,
            apellido: e.target.children.apellido.value,
            email: e.target.children.email.value,
            direccion: e.target.children.ciudad.value,
            telefono: e.target.children.telefono.value,
            contraseña: e.target.children.contraseña.value
            
        })
    })
})