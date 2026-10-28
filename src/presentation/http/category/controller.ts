import type { Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { CustomError } from '../../../domain';
import type { CreateCategoryDTO } from '../../../domain/dto/category/create-category.dto';
import type { AuthenticatedHandler } from '../../types/authenticated-request';
import type { ValidatedHandler } from '../../types/validated-request';
import { CategoryService } from './service/category.service';
import type { PaginationDTO } from '../../../domain/dto/shared/pagination.dto';

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    private handleError(err: unknown, res: Response) {
        if (err instanceof CustomError) return res.status(err.statusCode).json({ error: err.message });
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }

    public createCategory: AuthenticatedHandler<CreateCategoryDTO> = (req, res) => {
        this.categoryService.createCategory(req.body, req.user)
            .then(category => res.status(201).json(category))
            .catch(err => this.handleError(err, res))
    }

    public getCategories: ValidatedHandler<unknown, ParamsDictionary, PaginationDTO> = async (req, res) => {
        const { page, limit } = req.query;
        this.categoryService.getCategories(page, limit)
            .then(categories => res.status(200).json(categories))
            .catch(err => this.handleError(err, res));
    }
}
