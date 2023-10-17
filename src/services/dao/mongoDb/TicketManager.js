import ticketModel from "../../models/tickets.model.js";

export default class TicketManagerServices{
    constructor(){

    }

    createTicket = async (req, res) => {
      try {
        const newTicket = await ticketModel.create(req.body);
        res.status(201).send({ payload: newTicket });
      } catch (error) {
        console.error("request error: " + error);
        res.status(500).send({ error: error });
      }
    }

}