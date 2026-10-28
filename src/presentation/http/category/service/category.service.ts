import { CategoryModel } from "../../../../data";
import { CustomError } from "../../../../domain";
import { CreateCategoryDTO, GetCategoriesDTO, RegisterUserDTO } from "../../../../domain/dto";
import { AuthUser } from "../../../types/auth-user";

export class CategoryService {
    constructor() { }

    async createCategory(dto: CreateCategoryDTO, user: AuthUser) {
        const categoryExists = await CategoryModel.findOne({ name: dto.name });

        if (!!categoryExists) throw CustomError.internalServer('Internal server error');

        try {
            const category = new CategoryModel({
                ...dto,
                user: user.id
            });
            category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCategories(page: number, limit: number) {
        const skip = (page - 1) * limit
        try {
            const [categories, total] = await Promise.all([
                CategoryModel.find()
                    .skip(skip)
                    .limit(limit),
                CategoryModel.countDocuments()
            ]);

            return {
                data: categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available
                })),
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}