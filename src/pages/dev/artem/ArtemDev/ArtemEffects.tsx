import { FC, useEffect } from 'react';
import { postEffect } from '@shared/api/Effects/Models/postEffect';
import { IEffectPost } from '@shared/types/effects';



const ArtemEffects: FC = () => {
    const testPayload = {
        'id': null,
        'pseudoId': 2,
        'class_id': 10036,
        'type': 'in',
        'action_type': 'create',
        'key': 'block-2',
        'values': [
            {
                'destination': 10223,
                'source': {
                    'type': 4,
                    'value': 'attribute_id'
                }
            }
        ],
        'attribute_ids': [
            10223
        ]
    } as IEffectPost

    const getEffects = async () => {
        const effectsPayloads = [
            { ...testPayload },
            { ...testPayload }
        ]

        const effectsResponses = []

        const test = await Promise.all(effectsPayloads.map(async (effectsPayload, index) => {
            const resp = await postEffect(String(10007), effectsPayload)
            
            console.log('ARDEV', { ...resp.data })
            console.log('ARDEV2', resp.data)

            effectsResponses.push({ ...resp.data })

            return true
        }))

        console.log('ARDEV3', test)
        console.log('ARDEV4', effectsResponses)
    }


    useEffect(() => {
        getEffects().then()
    })

    return (
        <div>

        </div>
    );
};

export default ArtemEffects;