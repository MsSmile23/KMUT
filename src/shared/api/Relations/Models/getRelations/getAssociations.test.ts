/* import { z } from 'zod'

import login from '@tests/utils/loginTest'
import checkStatusAndSchema from '@tests/utils/checkStatusAndSchema'

import { SERVICES_SUBJECT_TYPES } from '@api/SubjectTypes'
import { ISubjectTypesGet } from '@typesapp/subject-types'

const responseSchema: z.ZodSchema<ISubjectTypesGet[]> = z.array(
    z.strictObject({
        id: z.number(),
        name: z.string(),
        is_deletable: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        is_device: z.boolean(),
        device_family_id: z.number().nullable(),
        params: z.any(),
        is_archived: z.boolean().optional(),
        parents: z.array(
            z.strictObject({
                id: z.number(),
                name: z.string(),
                device_family_id: z.number().nullable(),
                is_archived: z.boolean(),
                laravel_through_key: z.number(),
                is_device: z.boolean(),
                params: z.any(),
                created_at: z.string(),
                updated_at: z.string(),
            })
        ),
        child: z.array(
            z.strictObject({
                id: z.number(),
                name: z.string(),
                device_family_id: z.number().nullable(),
                is_archived: z.boolean(),
                laravel_through_key: z.number(),
                is_device: z.boolean(),
                params: z.any(),
                created_at: z.string(),
                updated_at: z.string(),
            })
        ),
        created_at: z.string(),
        updated_at: z.string(),
    })
)

describe('Получение типов субъектов', () => {
    beforeAll(login)

    checkStatusAndSchema(SERVICES_SUBJECT_TYPES.Models.getSubjectTypes, responseSchema)
})
 */