const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})



// //menambah satu data
// const contact1 = new Contact({
//     nama: 'nano aja',
//     nohp: '1234567890',
//     email: 'asapHelpMe@gmail.com'
// })

// //simpan ke collection
// contact1.save().then(r => console.log(r))