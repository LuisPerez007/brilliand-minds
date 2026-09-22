import 'dotenv/config'

const probarUnsplash = async () => {
  try {
    const respuesta = await fetch(
      'https://api.unsplash.com/photos/random?query=education',
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    )

    const datos = await respuesta.json()

    console.log('Status:', respuesta.status)
    console.log('Foto:', datos.urls?.regular)
    console.log('Fotógrafo:', datos.user?.name)
  } catch (error) {
    console.error('Error:', error)
  }
}

probarUnsplash()
