import { cx as cxBase } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

export const cx = cxBase
export const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs))

export const formDataFromTarget = <T>(target: EventTarget) => {
   const formData = new FormData(target as HTMLFormElement)
   return Object.fromEntries(formData.entries()) as T
}

export const parseJson = <T>(json: string): Promise<T> =>
   new Promise((resolve, reject) => {
      try {
         const result = JSON.parse(json) as T
         resolve(result)
      } catch (error) {
         reject(error)
      }
   })

type Success<T> = {
   data: T
   error: null
}

type Failure<E> = {
   data: null
   error: E
}

type Result<T, E = Error> = Success<T> | Failure<E>

export const tryCatch = async <T, E = Error>(
   promise: Promise<T>,
): Promise<Result<T, E>> => {
   try {
      const data = await promise
      return { data, error: null }
   } catch (error) {
      return { data: null, error: error as E }
   }
}
