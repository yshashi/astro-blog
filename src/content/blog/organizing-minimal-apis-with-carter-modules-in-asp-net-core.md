---
title: "Organizing Minimal APIs with Carter Modules in ASP.NET Core"
date: "2024-07-26"
description: "Minimal APIs in ASP.NET Core offer a lean and efficient way to build web applications. They are perfect for lightweight, fast-performing services. While Minimal APIs provide a clean foundation, you can leverage libraries like Carter to enhance their structure and modularity."
image: "/images/first.avif"
---

# Organizing Minimal APIs with Carter Modules in ASP.NET Core

Minimal APIs in ASP.NET Core offer a lean and efficient way to build web applications. They are perfect for lightweight, fast-performing services. While Minimal APIs provide a clean foundation, you can leverage libraries like Carter to enhance their structure and modularity. This blog post will guide you through using Carter modules to organize your Minimal API endpoints, using a URL shortener example for demonstration.

## What is Carter?

Carter is a lightweight, open-source library for building ASP.NET Core web APIs. It simplifies the process of defining API routes and handlers, offering a more structured and maintainable approach compared to using only Minimal APIs' built-in capabilities.

## Setting up Carter

First, install the Carter NuGet package in your ASP.NET Core project:

```bash
dotnet add package Carter
```

## Creating a Carter Module

To start, let's create a Carter module for our URL shortener example. We'll define two endpoints: one for creating short URLs and another for redirecting to the original URL based on the shortened code.

```csharp
using Carter;

public class ShortnerModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/short", async (
            [FromBody] UrlRequestDto request,
            UrlService urlService
        ) =>
        {
            var response = await urlService.ShortenUrlAsync(request.LongUrl);
            return response.StatusCode switch
            {
                200 => Results.Ok(response),
                400 => Results.BadRequest(response),
                _ => Results.Problem(response.ErrorMessage)
            };
        });
        
        app.MapGet("/{url_code}", async (
            [FromRoute(Name = "url_code")] string urlCode,
            UrlService urlService
        ) =>
        {
            var response = await urlService.GetLongUrlAsync(urlCode);
            return response is null ? Results.NotFound("Url not found") : Results.Redirect(response);
        });
        
        app.MapGet("/urls", async (
            UrlService urlService
        ) =>
        {
            var response = await urlService.GetUrlsAsync();
            return Results.Ok(response);
        });
        
        app.MapGet("/paged_urls", async (
            [FromQuery] int pageIndex,
            [FromQuery] int pageSize,
            UrlService urlService
        ) =>
        {
            var pagedUrls = await urlService.GetPagedUrlAsync(pageIndex, pageSize);
            return Results.Ok(pagedUrls);
        });
    }
}
```

## Registering the Carter Module

In your application's startup logic (usually `Program.cs`), register the Carter module:

```csharp
var builder = WebApplication.CreateBuilder(args);
// ... other configurations ...
builder.Services.AddCarter();

var app = builder.Build();
// ... other middleware ...

app.MapCarter(); 
app.Run();
```

## Advanced Endpoint Configurations with Carter in ASP.NET Core

With Carter, we can go a step further with some advanced configurations:

```csharp
public class ShortnerModule : CarterModule //updated from ICarterModule to CarterModule
{
    public ShortnerModule(): base("/api") // added base api as endpoint prefix
    {
       WithTags("Url Shortner"); // added tag name for openapi
       IncludeInOpenApi(); // included openapi
    }

    // Rest of the same code
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/short", async (
            [FromBody] UrlRequestDto request,
            UrlService urlService
        ) =>
        {
            var response = await urlService.ShortenUrlAsync(request.LongUrl);
            return response.StatusCode switch
            {
                200 => Results.Ok(response),
                400 => Results.BadRequest(response),
                _ => Results.Problem(response.ErrorMessage)
            };
        });
    }
}
```

## Explanation

In the Carter module, we define two GET endpoints using the `Get` method. Each endpoint takes a request (`req`) and a response (`res`) as arguments. Inside the endpoint handlers, we perform the necessary logic, such as generating short codes, retrieving original URLs, and setting response status codes and headers.

## Benefits of Carter

Using Carter modules for your Minimal APIs offers several advantages:

- **Modularity**: Organize your API endpoints into logical modules, improving maintainability and reusability.
- **Testability**: It is easier to test individual modules in isolation, promoting code quality.
- **Readability**: The Carter syntax simplifies defining routes and handlers, making your code more readable.
- **Flexibility**: Carter allows for various configurations and integrations, giving you control over your API structure.

## Conclusion

By using Carter modules, you can enhance your Minimal APIs with a structured and modular approach. This approach promotes better organization, testability, and overall maintainability of your web applications.
