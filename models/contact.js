const mongoose = require('mongoose')

const Contact = mongoose.model('Contact', {
    // nama: String //klo tanpa aturan tambahan
    nama: {
        type: String,
        required: true
    },
    nohp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // required: true
    },
})

module.exports = Contact