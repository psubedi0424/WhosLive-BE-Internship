import { Creator } from '../models/creator.model.js';

// Create a new creator
export const createCreator = async (req, res) => {
    try {
        const creator = await Creator.create(req.body);
        res.status(201).json({
            success: true,  
            data: creator
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all creators
export const getCreators = async (req, res) => {
    try {
        const creators = await Creator.find();
        res.status(200).json({
            success: true,
            count: creators.length,
            data: creators
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get creator by ID
export const getCreatorById = async (req, res) => {
    try {
        const creator = await Creator.findById(req.params.id);
        if (!creator) {
            return res.status(404).json({
                success: false,
                message: 'Creator not found'
            });
        }
        res.status(200).json({
            success: true,
            data: creator
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};