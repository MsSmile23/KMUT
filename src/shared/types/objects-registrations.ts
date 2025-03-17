export type objectsRegistration = {
    object?: any // в любом случае, если есть объект
  state: number
  result?: { //если state Успешно
    meas_result: any, // данные о замерах TODO: заменить
    meas_time: any, // TODO: заменить
  },
  errors?: any //если state Ошибка
}