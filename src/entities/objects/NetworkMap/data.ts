
const PDCX = 500
const DDCX = 1100
const build = {
    ar: { 'y': 400 },
    agg: { 'y': 500 },
    offsetY: 75,
    offsetX: 120,
}

export type initialArrType = {
    id: number,
    x: number,
    y: number,
    name?: string
}

export const initialArr = [
    {
        'id': '12459',
        'x': PDCX,
        'y': 50
    },
    {
        id: 13127,
        x: PDCX - 200,
        y: 50
    },
    {
        'id': '12458',
        'x': PDCX,
        'y': 125,
        'name': 'PDC-DR1',
    },
    {
        'id': '12436',
        'name': 'PDC-AR1',
        'x': PDCX,
        'y': 200,
    },

    {
        'id': '12372',
        'name': 'PDC-AGG1',
        'x': PDCX - 200,
        'y': 300
    },
    {
        'id': '12373',
        'name': 'PDC-AGG2',
        'x': PDCX + 200,
        'y': 300
    },

    {
        'id': '12457',
        'x': DDCX,
        'y': 50
    },
    {
        id: 13128,
        x: DDCX + 200,
        y: 50
    },
    {
        'id': '12456',
        'x': DDCX,
        'y': 125,
        'name': 'DDC-DR1'
    },
    {
        'id': '12437',
        'name': 'DDC-AR1',
        'x': DDCX,
        'y': 200
    },

    {
        'id': '12355',
        'x': DDCX - 200,
        'y': 300
    },
    {
        'id': '12356',
        'x': DDCX + 200,
        'y': 300
    },



    /* PNI */
    {
        'id': '12434',
        'name': 'PNI-AR1',
        'x': build.offsetX * 0 + 10,
        'y': build.ar.y
    },
    {
        'id': '12448',
        'name': 'PNI-AGG1',
        'x': build.offsetX * 0 + 10,
        'y': build.agg.y
    },
    {
        'id': '12435',
        'name': 'PNI-AR2',
        'x': build.offsetX * 1,
        'y': build.ar.y + 30
    },
    {
        'id': '12449',
        'name': 'PNI-AGG2',
        'x': build.offsetX * 1,
        'y': build.agg.y + 30
    },

    /* SA - Сириус Арена*/
    {
        'id': '12452',
        'name': 'SA-AGG1',
        'x': build.offsetX * 2,
        'y': build.ar.y + build.offsetY
    },
    {
        'id': '12453',
        'name': 'SA-AGG2',
        'x': build.offsetX * 2,
        'y': build.agg.y + build.offsetY
    },

    /* DS - Большой */
    {
        'id': '12432',
        'x': build.offsetX * 3,
        'y': build.ar.y + build.offsetY
    },
    {
        'id': '12450',
        'x': build.offsetX * 3,
        'y': build.agg.y + build.offsetY
    },
    {
        'id': '12433',
        'x': build.offsetX * 4,
        'y': build.ar.y + build.offsetY
    },
    {
        'id': '12451',
        'x': build.offsetX * 4,
        'y': build.agg.y + build.offsetY
    },

    /* TA */
    {
        'id': '12424',
        'name': 'TA-AGG1',
        'x': build.offsetX * 5,
        'y': build.ar.y + build.offsetY * 2
    },
    {
        'id': '12425',
        'name': 'TA-AGG2',
        'x': build.offsetX * 5,
        'y': build.agg.y + build.offsetY * 2
    },

    /* AIS */
    {
        'id': '12426',
        'x': build.offsetX * 6,
        'y': build.ar.y + build.offsetY * 2
    },
    {
        'id': '12420',
        'x': build.offsetX * 6,
        'y': build.agg.y + build.offsetY * 2
    },
    {
        'id': '12427',
        'x': build.offsetX * 7,
        'y': build.ar.y + build.offsetY * 2
    },
    {
        'id': '12421',
        'x': build.offsetX * 7,
        'y': build.agg.y + build.offsetY * 2
    },

    /* CAF */
    {
        'id': '12474',
        'x': build.offsetX * 8,
        'y': build.ar.y + build.offsetY
    },
    {
        'id': '12475',
        'x': build.offsetX * 8,
        'y': build.agg.y + build.offsetY
    },
    /* SCF */
    {
        'id': '12301',
        'x': build.offsetX * 9,
        'y': build.ar.y + build.offsetY
    },
    {
        'id': '11469',
        'x': build.offsetX * 9,
        'y': build.agg.y + build.offsetY
    },
    {
        'id': '12302',
        'x': build.offsetX * 10,
        'y': build.ar.y + build.offsetY
    },
    {
        'id': '11470',
        'x': build.offsetX * 10,
        'y': build.agg.y + build.offsetY
    },
    /* CAF - ASW */
    {
        'id': '12311',
        'x': build.offsetX * 9.5,
        'y': build.agg.y + build.offsetY + 100
    },

    {
        'id': '12312',
        'x': build.offsetX * 9.5,
        'y': build.agg.y + build.offsetY + 100
    },
    {
        'id': '12310',
        'x': build.offsetX * 9.5,
        'y': build.agg.y + build.offsetY + 100
    },

    {
        'id': 12503,
        'x': build.offsetX * 9.5,
        'y': build.agg.y + build.offsetY + 100
    },

    /* MD */
    {
        'id': '12430',
        'x': build.offsetX * 11,
        'y': build.ar.y
    },
    {
        'id': '12422',
        'x': build.offsetX * 11,
        'y': build.agg.y
    },
    {
        'id': '12431',
        'x': build.offsetX * 12,
        'y': build.ar.y
    },
    {
        'id': '12423',
        'x': build.offsetX * 12,
        'y': build.agg.y
    },
]