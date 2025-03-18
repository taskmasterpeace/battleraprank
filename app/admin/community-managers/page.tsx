import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CommunityManagersManager from "@/components/admin/CommunityManagersManager"

export default function CommunityManagersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Community Managers</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>About Community Managers</CardTitle>
            <CardDescription>
              Community managers help maintain the Alt Battle Rap Algorithm by adding battlers and moderating content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Community managers have special permissions to add battlers to the platform and help maintain the quality
              of the content. They can add new battlers, update battler information, and moderate user-generated
              content. Each battler added to the system is tracked to the community manager who added them.
            </p>
          </CardContent>
        </Card>

        <CommunityManagersManager />
      </div>
    </div>
  )
}

