"use client"

import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Field, FieldContent, FieldError } from "./ui/field"

const formSchema = z.object({
  title: z.string().trim().min(1, {
    message: "Digite algo para buscar",
  }),
})

type FormData = z.infer<typeof formSchema>

export default function Search() {
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  function onSubmit(data: FormData) {
    router.push(`/barbershops?title=${encodeURIComponent(data.title)}`)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex items-start gap-2"
    >
      <Field className="flex-1">
        <FieldContent>
          <Controller
            control={form.control}
            name="title"
            render={({ field }) => (
              <Input
                placeholder="Faça sua busca..."
                value={field.value}
                onChange={(e) =>
                  field.onChange(
                    (e as React.ChangeEvent<HTMLInputElement>).target.value,
                  )
                }
              />
            )}
          />

          <FieldError errors={[form.formState.errors.title]} />
        </FieldContent>
      </Field>

      <Button type="submit" size="icon">
        <SearchIcon className="size-4" />
      </Button>
    </form>
  )
}
