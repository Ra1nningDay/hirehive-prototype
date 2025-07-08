package router

import (
	_ "github.com/EyeQuila/eyeQcheck/docs" // Import the generated Swagger docs
	"github.com/EyeQuila/eyeQcheck/internal/controller"
	"github.com/EyeQuila/eyeQcheck/internal/middleware"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// initializes the Gin router and sets up the API routes.
func RegisterRoutes(r *gin.Engine) {
	// Swagger documentation route
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Main API group
	api := r.Group("/api")
	
	// Protected routes (require JWT token from OAuth2)
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// Authenticated user routes
		user := protected.Group("/user")
		user.Use(middleware.RateLimitMiddleware()) 
		{
			// Conversation routes (unlimited)
			chat := user.Group("/conversation") 
			{
				chat.POST("/chat", controller.ChatController)
				chat.POST("/speech-to-text", controller.SpeechToTextController)
			}
		}

		// Assessnment routes 
		// assessment := protected.Group("/assessment")
		// {
		// 	// Assessment routes (unlimited)
		// 	assessment.POST("/submit", controller.SubmitAssessmentController) // Example route for submitting assessments
		// 	assessment.GET("/results", controller.GetAssessmentResultsController) // Example route for getting assessment results
		// 	assessment.GET("/history", controller.GetAssessmentHistoryController) // Example route for getting assessment history
		// 	assessment.GET("/details/:id", controller.GetAssessmentDetailsController) // Example route for getting assessment details by ID
		// 	assessment.PUT("/update/:id", controller.UpdateAssessmentController) // Example route for updating an assessment by ID
		// 	assessment.DELETE("/delete/:id", controller.DeleteAssessmentController) // Example route for deleting an assessment by ID
		// }

		// Authenticated user management routes
		profile := protected.Group("/profile")
		{
			// Get user profile
			profile.GET("", controller.GetUserProfileController)
			profile.PUT("", controller.UpdateUserProfileController)
		}
	}

	// Guest/Anonymous routes (no authentication required)
	guest := api.Group("/guest")
	guest.Use(middleware.GuestRateLimitMiddleware()) 
	{
		// Limited conversation routes for non-logged-in users
		chat := guest.Group("/conversation")
		{
			chat.POST("/demo-chat", controller.DemoChatController)
			chat.POST("/speech-to-text", controller.DemoSpeechToTextController) 
		}
	}

	// Public routes (no authentication required)
	public := api.Group("/public")
	{
		public.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "healthy"})
		})
		
		// User registration from external OAuth system
		public.POST("/register-user", controller.RegisterUserController)
	}
}