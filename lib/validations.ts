import { z } from "zod"

const azerbaijaniLettersRegex = /^[\p{L}\s'-]*$/u

// User Registration Schema (Student)
export const userRegistrationSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Ad ən azı 2 hərf olmalıdır")
      .max(50, "Ad 50 hərfdən çox ola bilməz")
      .refine((val) => azerbaijaniLettersRegex.test(val) || /^[a-zA-Z\s'-]+$/.test(val), {
        message: "Ad yalnız hərflərdən ibarət olmalıdır",
      }),

    lastName: z
      .string()
      .min(2, "Soyad ən azı 2 hərf olmalıdır")
      .max(50, "Soyad 50 hərfdən çox ola bilməz")
      .regex(/^[a-zA-ZəüöğıçşĞÜÖƏIÇŞİ\s]+$/, "Soyad yalnız hərflərdən ibarət olmalıdır"),

    fatherName: z
      .string()
      .min(2, "Ata adı ən azı 2 hərf olmalıdır")
      .max(50, "Ata adı 50 hərfdən çox ola bilməz")
      .regex(/^[a-zA-ZəüöğıçşĞÜÖƏIÇŞİ\s]+$/, "Ata adı yalnız hərflərdən ibarət olmalıdır"),

    birthDate: z.string().min(1, "Doğum tarixi seçilməlidir"),

    region: z.string().min(1, "Ərazi seçilməlidir"),

    school: z.string().min(3, "Məktəb adı ən azı 3 hərf olmalıdır").max(100, "Məktəb adı 100 hərfdən çox ola bilməz"),

    class: z
      .string()
      .min(1, "Sinif seçilməlidir")
      .refine((val) => ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"].includes(val), {
        message: "Düzgün sinif seçin",
      }),

    email: z
      .string()
      .email("Düzgün email ünvanı daxil edin")
      .min(5, "Email ən azı 5 simvol olmalıdır")
      .max(100, "Email 100 simvoldan çox ola bilməz")
      .transform((val) => val.toLowerCase().trim()), // normalize email

    password: z
      .string()
      .min(6, "Şifrə ən azı 6 simvol olmalıdır")
      .max(50, "Şifrə 50 simvoldan çox ola bilməz")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Şifrədə kiçik hərf, böyük hərf və rəqəm olmalıdır"),

    confirmPassword: z.string().min(6, "Şifrə təkrarı ən azı 6 simvol olmalıdır"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifrələr uyğun gəlmir",
    path: ["confirmPassword"],
  })

// Parent/Teacher Registration Schema
export const parentRegistrationSchema = z
  .object({
    role: z.enum(["parent", "teacher", "director"], {
      errorMap: () => ({ message: "Rol seçilməlidir" }),
    }),

    firstName: z
      .string()
      .min(2, "Ad ən azı 2 hərf olmalıdır")
      .max(50, "Ad 50 hərfdən çox ola bilməz")
      .refine((val) => azerbaijaniLettersRegex.test(val) || /^[a-zA-Z\s'-]+$/.test(val), {
        message: "Ad yalnız hərflərdən ibarət olmalıdır",
      }),

    lastName: z
      .string()
      .min(2, "Soyad ən azı 2 hərf olmalıdır")
      .max(50, "Soyad 50 hərfdən çox ola bilməz")
      .regex(/^[a-zA-ZəüöğıçşĞÜÖƏIÇŞİ\s]+$/, "Soyad yalnız hərflərdən ibarət olmalıdır"),

    fatherName: z
      .string()
      .min(2, "Ata adı ən azı 2 hərf olmalıdır")
      .max(50, "Ata adı 50 hərfdən çox ola bilməz")
      .regex(/^[a-zA-ZəüöğıçşĞÜÖƏIÇŞİ\s]+$/, "Ata adı yalnız hərflərdən ibarət olmalıdır"),

    birthDate: z.string().min(1, "Doğum tarixi seçilməlidir"),

    region: z.string().min(1, "Ərazi seçilməlidir"),

    school: z.string().min(3, "Məktəb adı ən azı 3 hərf olmalıdır").max(100, "Məktəb adı 100 hərfdən çox ola bilməz"),

    email: z
      .string()
      .email("Düzgün email ünvanı daxil edin")
      .min(5, "Email ən azı 5 simvol olmalıdır")
      .max(100, "Email 100 simvoldan çox ola bilməz")
      .transform((val) => val.toLowerCase().trim()), // normalize email

    password: z
      .string()
      .min(6, "Şifrə ən azı 6 simvol olmalıdır")
      .max(50, "Şifrə 50 simvoldan çox ola bilməz")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Şifrədə kiçik hərf, böyük hərf və rəqəm olmalıdır"),

    confirmPassword: z.string().min(6, "Şifrə təkrarı ən azı 6 simvol olmalıdır"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifrələr uyğun gəlmir",
    path: ["confirmPassword"],
  })

// Test Data Schema
export const testDataSchema = z.object({
  textbook: z.string().min(1, "Dərslik seçilməlidir"),
  topic: z.string().min(1, "Mövzu seçilməlidir"),
  class: z.string().min(1, "Sinif seçilməlidir"),
})

// Question Schema
export const questionSchema = z.object({
  id: z.number(),
  question: z.string().min(1, "Sual mətni olmalıdır"),
  options: z.array(z.string()).length(4, "4 variant olmalıdır"),
  correctAnswer: z.number().min(0).max(3, "Düzgün cavab 0-3 arasında olmalıdır"),
  explanation: z.string().min(1, "İzahat olmalıdır"),
})

// Test Results Schema
export const testResultsSchema = z.object({
  userId: z.number().optional(),
  testData: testDataSchema,
  questions: z.array(questionSchema),
  answers: z.record(z.string(), z.number()),
  score: z.number().min(0).max(100),
  timeSpent: z.number().min(0),
  completedAt: z.string().datetime(),
})

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>
export type ParentRegistrationData = z.infer<typeof parentRegistrationSchema>
export type TestData = z.infer<typeof testDataSchema>
export type Question = z.infer<typeof questionSchema>
export type TestResults = z.infer<typeof testResultsSchema>
