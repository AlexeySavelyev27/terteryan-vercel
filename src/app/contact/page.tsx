import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-light">Обратная связь</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Свяжитесь со мной для сотрудничества, заказа произведений или по любым другим вопросам
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact form */}
        <Card>
          <CardHeader>
            <CardTitle>Отправить сообщение</CardTitle>
            <CardDescription>Заполните форму ниже, и я свяжусь с вами в ближайшее время</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Имя</Label>
                <Input id="firstName" placeholder="Ваше имя" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Фамилия</Label>
                <Input id="lastName" placeholder="Ваша фамилия" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Тема</Label>
              <Input id="subject" placeholder="Тема сообщения" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Сообщение</Label>
              <Textarea id="message" placeholder="Ваше сообщение..." className="min-h-[120px]" />
            </div>

            <Button className="w-full flex items-center gap-2">
              <Send className="h-4 w-4" />
              Отправить сообщение
            </Button>
          </CardContent>
        </Card>

        {/* Contact information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
              <CardDescription>Другие способы связи со мной</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">composer@example.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Телефон</p>
                  <p className="text-sm text-muted-foreground">+7 (XXX) XXX-XX-XX</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Местоположение</p>
                  <p className="text-sm text-muted-foreground">Москва, Россия</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Сотрудничество</CardTitle>
              <CardDescription>Области, в которых я готов к сотрудничеству</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Написание музыки на заказ</li>
                <li>• Аранжировки и оркестровки</li>
                <li>• Музыкальное сопровождение мероприятий</li>
                <li>• Преподавание композиции</li>
                <li>• Участие в музыкальных проектах</li>
                <li>• Консультации по вопросам композиции</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Время ответа</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Обычно я отвечаю на сообщения в течение 24-48 часов. Для срочных вопросов рекомендую связаться по
                телефону.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
