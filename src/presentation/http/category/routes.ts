import { Router } from 'express';
import { CategoryController } from './controller';
import { createCategorySchema } from './category.schemas';
import { authenticatedRoute } from '../../middleware/authenticated-route';
import { CategoryService } from './service/category.service';
import { validatedRoute } from '../../middleware/validated-route';
import { PaginationSchema } from '../shared/pagination.schemas';

export class CategoryRoutes {


    static get routes(): Router {

        const router = Router();

        const categoryService = new CategoryService();
        const categoryController = new CategoryController(categoryService);

        router.post(
            '/',
            ...authenticatedRoute({
                body: createCategorySchema,
                handler: categoryController.createCategory
            })
        );

        router.get(
            '/',
            ...validatedRoute({
                query: PaginationSchema,
                handler: categoryController.getCategories
            })
        );

        return router;
    }
}
