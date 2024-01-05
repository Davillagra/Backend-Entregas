
const updateUser = async ()=>{
    const updateForms = document.querySelectorAll('#userCard')
    const deleteButtons = document.querySelectorAll('.deleteButton')
    updateForms.forEach((form)=>{
        form.addEventListener('submit',async (e)=>{
            e.preventDefault()
            const formData = new FormData(form)
            const _id = formData.get('_id')
            const checkboxValue = form.querySelector('input[type="checkbox"]').checked
            if(checkboxValue){
                try {
                    const response = await fetch(`/api/users/premium/${_id}`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    if(response.ok) {
                        Swal.fire({
                          position: 'top-end',
                          icon: 'success',
                          title: `Se actualizó el rol`,
                          showConfirmButton: true,
                          toast: true,
                        })
                        window.location.reload()
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            form.reset()
        })
    })
    deleteButtons.forEach((button) => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const _id = button.getAttribute('value');
            try {
                const response = await fetch(`/api/users/delete/${_id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok) {
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: `Se eliminó el usuario`,
                      showConfirmButton: true,
                      toast: true,
                    })
                    window.location.reload()
                }
            } catch (error) {
                console.log(error)
            }
            
        })
    })
}
updateUser()