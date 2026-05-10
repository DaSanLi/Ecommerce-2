import { Request } from 'express';


export enum priorityState {
    baja = "baja",
    media = "media",
    alta = "alta",
    urgente = "urgente"
}

export enum taskStatus {
    pendiente = "pendiente",
    asignada = "asignada",
    realizando = "realizando",
    completada = "completada"
}


export interface ReqTaskAuth extends Request {
    user: {
        email: string;
    }
}