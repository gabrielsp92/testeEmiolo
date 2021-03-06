const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {User} = require('./../models/user');

//seed
const users = [{
    __id: new ObjectID(),
    name: 'gabriel',
    age: 24,
    email: 'gsoaresp92',
    pass: 'gab123',
},{
    __id: new ObjectID(),
    name: 'angelo',
    age: 31,
    email: 'angel',
    pass: 'jujuba',
}];

//runs before each method to set the database
beforeEach((done) => {
    User.remove({}).then(() => {
        //populating table for testing
        return User.insertMany(users);
    }).then(() =>{
        done();
    })
});

//test POST /user.
describe('POST /user', () => {
    it('should create a new user', (done) => {
        
        var name = "User Test";
        var age = 13;
        var email = "logtest";
        var pass = "test";

        request(app)
            .post('/user')
            .send({
               name,age,email,pass
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(name);
                expect(res.body.age).toBe(age);
                expect(res.body.email).toBe(email);
                expect(res.body.pass).toBe(pass);

            })
            .end((err, res) => {
                if (err){
                    return done(err);
                }

                User.find({name}).then((users) => {
                    expect(users.length).toBe(1);
                    expect(users[0].name).toBe(name);
                    expect(users[0].age).toBe(age);
                    expect(users[0].email).toBe(email);
                    expect(users[0].pass).toBe(pass);
                    done();
                }).catch((e) => done(e));
            });
    });
});

//test POST /user with invalid data
describe('POST /user', () => {
    it('should not create a new user with invalid data', (done) => {       

        request(app)
            .post('/user')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err){
                    return done(err);
                }
                User.find().then((users) => {
                    expect(users.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

//test GET /user
describe('GET /user', () => {
    it('should get all users', (done) => {       

        request(app)
            .get('/user')
            .expect(200)
            .expect((res) => {
                expect(res.body.users.length).toBe(2);
            })
            .end((err, res) => {
                if (err){
                    return done(err);
                }
                User.find().then((users) => {
                    expect(users.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

// //test GET /user/:id
// not working
// describe('GET /user/:id',() =>{
//     it('should return user by id', (done) => {
//         request(app)
//             .get(`/user/${users[0].__id}`)
//             .expect(200)
//             .expect((res) => {
//                 expect(users[0].__id).toBe(users[0]);
//                 expect(res.body.user.name).toBe(users[0].name);
//             })
//             .end(done);
//     });


//     it('should return 404 if todo not found', (done) => {
//         var hexId = new ObjectID().toHexString();

//         request(app)
//             .get(`/user/${hexId}`)
//             .expect(404)
//             .end(done);
//     });
//     it('should return 404 for non-object ids', (done) => {
//         request(app)
//         .get(`/user/123`)
//         .expect(404)
//         .end(done);
//     });
// });