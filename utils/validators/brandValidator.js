const { check , body } = require('express-validator');
const slugify = require('slugify');

const validatorMiddleWare = require('../../middlewares/validatorMiddleWares')

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    validatorMiddleWare,
  ];

exports.createBrandValidator = [
check('name')
.notEmpty()
.withMessage('Brand required')
.isLength({ min:3 })
.withMessage('Too short Brand name')
.isLength({ max:32 })
.withMessage('Too long Brand name')
.custom((val, { req }) => {
  req.body.slug = slugify(val);
  return true;
}),
validatorMiddleWare
];

exports.updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  body('name').optional().custom((val, { req }) => {
    req.body.slug = slugify(val); //  req.body.slug = slugify(req.body.name)
    return true; //next()
  }),
  validatorMiddleWare,
];

exports.deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validatorMiddleWare,
];
