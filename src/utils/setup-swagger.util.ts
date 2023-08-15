/* eslint-disable prettier/prettier */
import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle("NestJS-Authentication-Full")
    .setContact(
        "olaobey15@gmail.com",
        "olaobey",
        "Samuel"
        )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("documentation", app, document);
}