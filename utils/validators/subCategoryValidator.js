const { check ,body } = require('express-validator');
const slugify = require('slugify');

const validatorMiddleWare = require('../../middlewares/validatorMiddleWares');

exports.getSubCategoryIdValidator = [
    check('id').isMongoId().withMessage('Invalid category id format '),
    validatorMiddleWare
];

exports.createSubCategoryValidator = [
    check('name')
    .notEmpty()
    .withMessage('subCategory required')
    .isLength({ min:2 })
    .withMessage('Too short subcategory name')
    .isLength({ max:32 })
    .withMessage('Too long subcategory name')
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),

    check('category')
    .notEmpty()
    .withMessage('subCategory must be belong to category')
    .isMongoId()
    .withMessage('invalid subcategory id'),

    validatorMiddleWare
    ];

    exports.updateSubCategoryValidator = [
       check('id')
       .isMongoId()
       .withMessage('Invalid category id format '),
       body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
       validatorMiddleWare
    ];

    exports.deleteSubCategoryValidator =[
        check('id')
        .isMongoId()
        .withMessage('Invalid category id format '),
        validatorMiddleWare
    ];
