import bcrypt from 'bcryptjs'

const crearHash = async () => {
  const hash = await bcrypt.hash('luis', 10)
  console.log('hash: >> ', hash)
}

crearHash()
