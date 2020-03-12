const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /books', () => {
    //Normal test case
    //Tells us we got back a status of 200 
    //And the content-type was indeed JSON
    //Using regex which simply matches the word 'json' in the header value
    it('should return an array of books', () => {
        return supertest(app)
            .get('/books')
            .expect(200)
            .expect('Content-Type', /json/)
            //This tells us about the actual data
            //Is it an array => does contain the expected books => are the books formatted correctly
            //To do this we add a then handler to chain & get the response object itself 
            .then(res => {
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1);
                const book = res.body[0];
                expect(book).to.include.all.keys(
                    'bestsellers_date', 'author', 'description', 'title'
                );
            })
    })

    //Testing that the sort query param should be on of  'title' or 'rank'
    //We get a 400 if its neither of these 
    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/books')
            .query({ sort: 'MISTAKE'})
            .expect(400, 'Sort must be one of title or rank');
    })

    it('should sort by title', () => {
        return supertest(app)
            .get('/books')
            .query({ sort: 'title'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true; 

                let i = 0; 
                
                //iterate once less than the length of the array 
                //because we're comparing 2 items in the array at a time
                while ( i < res.body.length - 1) {
                    //comapre book at `i` with next book at `i + 1`
                    const bookAtI = res.body[i];
                    const bookAtIPlus1 = res.body[i + 1];
                    //if the next book is less than the book at i,
                    if (bookAtIPlus1.title < bookAtI.title) {
                        //the books were not sorted correctly 
                        sorted = false; 
                        break; //exit the loop
                    }
                    i ++
                }
                expect(sorted).to.be.true; 
            })
    })
})