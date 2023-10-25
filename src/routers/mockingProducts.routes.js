import { Router } from "express";
import { faker} from '@faker-js/faker'

const router = Router();


router.get("/", async (req, res)=> {
   try {
    let fakeProducts = []

    for(let i = 0; i <100; i++){
        let product = {
            id:faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description:faker.commerce.productDescription(),
            thumbnail: faker.image.url(),
            price: faker.commerce.price({ min: 10, max: 100, symbol: '$' }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(50),
        }
        fakeProducts.push(product)
    }

    res.send({products: fakeProducts})
   } catch (error) {
    console.log(error)
    res.status(500).send({error: error, message: "Server Error, not poducts to show"})
   }
})

export default router;