import { NextApiRequest, NextApiResponse } from "next";

type Data = {
    name: String;
};

export default function handler( req: NextApiRequest, res: NextApiResponse ){
    res.status(200).json({name: "Rishi Bansal"});
}