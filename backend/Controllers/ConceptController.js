import Models from "../Models/index.js";

export default {
    add: async (req, res, next) => {
        try {
            const reg = await Models.Concept.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    list: async (req, res, next) => {
        try {
            let query = {
                $or: [{ 'name': new RegExp(req.query.value, 'i') }, { 'category': new RegExp(req.query.value, 'i') }]
            }

            if(req.query.isActive) {
                query.isActive = req.query.isActive;
            }
            
            const reg = await Models.Concept.find(query, { createdAt: 0 }) //Buscar por nombre y descripcion ignorando mayusculas o minusculas, no mostrar createdAt
                .sort({ 'createdAt': -1 }) //Ordenado por fecha de creacion desc
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },
}