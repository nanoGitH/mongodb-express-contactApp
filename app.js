const express = require('express')
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override')


const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./utils/db')   //gk perlu masuk ke variabel, karna cuma perlu koneksi ke database aja (kek require biasa kek di php)
const Contact = require('./models/contact')

const app = express()
const port = 3000

app.use(methodOverride('_method'))

//template engine
app.set('view engine', 'ejs')

//biar rootnya ke folder public
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//konfigurasi flash AAAAAAAAAAAAAAAAAAAAAAA CUMA BUAT FLASH DONG RIBET BGTTTT!!!
app.use(cookieParser('secret'))
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//route ke halaman home
app.get('/', (req, res) => {
    res.render('index', {nama: 'aaaaaaaaaaaaaaaaa', title: 'home index'})
})
//route ke halaman about
app.get('/about', (req, res) => {
    res.render('about', {title: 'about'})
})
//route ke halaman contact
app.get('/contact', async (req, res) => {
    // Contact.find().then(contact => {         //tanpa async await
    //     res.send(contact)
    // })

    const contacts = await Contact.find()
    res.render('contact', {
        title: 'contact',
        contacts,
        msg: req.flash('msg')
    })
})

//halaman tambah
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'form tambah kontak'
    })
})

//proses tambah data
app.post(
    '/contact', 
    [
    body('nama').custom( async (value) => {
        const duplikat = await Contact.findOne({ nama: value })
        if (duplikat) {
            throw new Error('nama kontak sudah ada')
        }
        return true
    }),
        check('email', 'email tidak valid').isEmail(),
        check('nohp', 'nohp tidak valid').isMobilePhone('id-ID')
    ],
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('add-contact', {
                title: 'form tambah kontak',
                errors: errors.array()
            })
        }else {
            Contact.insertMany(req.body, (error, result) => {
                //kirim flash massage AAAAAAAAAAAAAAAAAAAAA
                req.flash('msg', 'data kontak berhasil ditambahkan')
                res.redirect('/contact')
            })
        }
})

// //proses hapus data
// app.get('/contact/delete/:nama', async (req, res) => {
//     const contact = await Contact.findOne({ nama:req.params.nama })

//     if(!contact) {
//         res.status(404)
//         res.send('<h1>404</h1>')
//     }else {
//         Contact.deleteOne({ _id: contact._id }).then(result => {
//             req.flash('msg', 'data kontak berhasil diihapus')
//             res.redirect('/contact')            
//         })
//     }
// })

//proses hapus data tapi menggunakan method DELETE
app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then(result => {
        req.flash('msg', 'data kontak berhasil diihapus')
        res.redirect('/contact')  
    })
})

//halaman ubah
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('edit-contact', {
        title: 'form ubah kontak',
        contact,
    })
})

//proses ubah data
app.put(
    '/contact', 
    [
    body('nama').custom(async (value, {req}) => {
        const duplikat = await Contact.findOne({ nama: value })
        if (value !== req.body.oldName && duplikat) {
            throw new Error('nama kontak sudah ada')
        }
        return true
    }),
        check('email', 'email tidak valid').isEmail(),
        check('nohp', 'nohp tidak valid').isMobilePhone('id-ID')
    ],
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('edit-contact', {
                title: 'form ubah kontak',
                errors: errors.array(),
                contact: req.body
            })
        }else {
            Contact.updateOne(
                { _id: req.body._id },
                {
                    $set: {
                        nama: req.body.nama,
                        email: req.body.email,
                        nohp: req.body.nohp,
                    }
                },
                ).then(result => {
                    //kirim flash massage AAAAAAAAAAAAAAAAAAAAA
                    req.flash('msg', 'data kontak berhasil diubah')
                    res.redirect('/contact')
                })
        }
})

//routing halaman detail
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('detail', {
        title: 'halaman detailcontact',
        contact,
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })