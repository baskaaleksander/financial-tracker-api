// Add these schemas to your existing components/schemas section:

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Transaction ID
 *         amount:
 *           type: number
 *           description: Transaction amount
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Transaction type
 *         description:
 *           type: string
 *           description: Transaction description
 *         categoryName:
 *           type: string
 *           description: Name of the category
 *         categoryId:
 *           type: string
 *           description: ID of the category
 *         userId:
 *           type: string
 *           description: ID of the user who owns this transaction
 *         date:
 *           type: string
 *           format: date-time
 *           description: Transaction date
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Transaction creation date
 *     CreateTransactionRequest:
 *       type: object
 *       required:
 *         - amount
 *         - type
 *         - description
 *         - category
 *       properties:
 *         amount:
 *           type: number
 *           description: Transaction amount
 *           example: 100.50
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Transaction type
 *           example: "expense"
 *         description:
 *           type: string
 *           description: Transaction description
 *           example: "Grocery shopping"
 *         category:
 *           type: string
 *           description: Category name
 *           example: "Food"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Transaction date (optional, defaults to current date)
 *           example: "2023-01-01T00:00:00.000Z"
 *     UpdateTransactionRequest:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           description: Transaction amount
 *           example: 120.75
 *         description:
 *           type: string
 *           description: Transaction description
 *           example: "Updated grocery shopping"
 *         category:
 *           type: string
 *           description: Category name
 *           example: "Updated Food"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Transaction date
 *           example: "2023-01-02T00:00:00.000Z"
 *     CategoryBreakdownItem:
 *       type: object
 *       properties:
 *         categoryId:
 *           type: string
 *           description: Category ID
 *         totalAmount:
 *           type: number
 *           description: Total amount for this category
 *     DailyBreakdownItem:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: Date in YYYY-MM-DD format
 *         totalIncome:
 *           type: number
 *           description: Total income for this date
 *         totalExpenses:
 *           type: number
 *           description: Total expenses for this date
 *         netBalance:
 *           type: number
 *           description: Net balance for this date
 *     Report:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Report ID
 *         userId:
 *           type: string
 *           description: User ID who owns this report
 *         dateFrom:
 *           type: string
 *           format: date-time
 *           description: Report start date
 *         dateTo:
 *           type: string
 *           format: date-time
 *           description: Report end date
 *         totalIncome:
 *           type: number
 *           description: Total income for the period
 *         totalExpenses:
 *           type: number
 *           description: Total expenses for the period
 *         netBalance:
 *           type: number
 *           description: Net balance (income - expenses)
 *         incomeByCategory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryBreakdownItem'
 *         expensesByCategory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryBreakdownItem'
 *         dailyBreakdown:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DailyBreakdownItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Report creation date
 *     GeneratedReport:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID
 *         dateFrom:
 *           type: string
 *           format: date-time
 *           description: Report start date
 *         dateTo:
 *           type: string
 *           format: date-time
 *           description: Report end date
 *         totalIncome:
 *           type: number
 *           description: Total income for the period
 *         totalExpenses:
 *           type: number
 *           description: Total expenses for the period
 *         netBalance:
 *           type: number
 *           description: Net balance (income - expenses)
 *         byCategory:
 *           type: object
 *           properties:
 *             income:
 *               type: object
 *               additionalProperties:
 *                 type: number
 *               description: Income breakdown by category
 *             expense:
 *               type: object
 *               additionalProperties:
 *                 type: number
 *               description: Expense breakdown by category
 *         dailyBreakdown:
 *           type: object
 *           additionalProperties:
 *             type: object
 *             properties:
 *               income:
 *                 type: number
 *               expense:
 *                 type: number
 *               netBalance:
 *                 type: number
 *     SaveReportRequest:
 *       type: object
 *       required:
 *         - userId
 *         - dateFrom
 *         - dateTo
 *         - totalIncome
 *         - totalExpenses
 *         - netBalance
 *         - incomeByCategory
 *         - expensesByCategory
 *         - dailyBreakdown
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID
 *         dateFrom:
 *           type: string
 *           format: date-time
 *           description: Report start date
 *         dateTo:
 *           type: string
 *           format: date-time
 *           description: Report end date
 *         totalIncome:
 *           type: number
 *           description: Total income for the period
 *         totalExpenses:
 *           type: number
 *           description: Total expenses for the period
 *         netBalance:
 *           type: number
 *           description: Net balance (income - expenses)
 *         incomeByCategory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryBreakdownItem'
 *         expensesByCategory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryBreakdownItem'
 *         dailyBreakdown:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DailyBreakdownItem'
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Category ID
 *         name:
 *           type: string
 *           description: Category name
 *         description:
 *           type: string
 *           description: Category description
 *         color:
 *           type: string
 *           description: Category color (hex code)
 *         userId:
 *           type: string
 *           description: ID of the user who owns this category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Category creation date
 *     CreateCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Category name
 *           example: "Food"
 *         description:
 *           type: string
 *           description: Category description
 *           example: "Food and dining expenses"
 *         color:
 *           type: string
 *           description: Category color (hex code)
 *           example: "#FF5733"
 *     UpdateCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Category name
 *           example: "Updated Food"
 *         description:
 *           type: string
 *           description: Category description
 *           example: "Updated food and dining expenses"
 *         color:
 *           type: string
 *           description: Category color (hex code)
 *           example: "#33FF57"
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         firstName:
 *           type: string
 *           description: User's first name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation date
 *     LoginResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         firstName:
 *           type: string
 *           description: User's first name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         access_token:
 *           type: string
 *           description: JWT access token (expires in 15 minutes)
 *         refresh_token:
 *           type: string
 *           description: JWT refresh token (expires in 30 days)
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "error"
 *         statusCode:
 *           type: integer
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 */
