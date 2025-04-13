import generateUISounds from '../src/utils/generateUISounds'

// Run the sound generation
generateUISounds().then(() => {
  console.log('UI sounds generated successfully')
}).catch(error => {
  console.error('Error generating UI sounds:', error)
}) 