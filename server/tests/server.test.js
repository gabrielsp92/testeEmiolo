const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {User} = require('./../models/user');

//seed
const users = [{
    name: 'gabriel',
    age: 24,
    login: 'gsoaresp92',
    pass: 'gab123',
},{
    name: 'angelo',
    age: 31,
    login: 'angel',
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
        var login = "logtest";
        var pass = "test";

        request(app)
            .post('/user')
            .send({
               name,age,login,pass
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(name);
                expect(res.body.age).toBe(age);
                expect(res.body.login).toBe(login);
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
                    expect(users[0].login).toBe(login);
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
    it('get all users', (done) => {       

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

