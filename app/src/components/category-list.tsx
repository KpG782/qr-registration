"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Edit, Trash2, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { QRCodeDisplay } from "./qr-code-display";

interface Category {
  id: string;
  name: string;
  participantCount: number;
}

interface CategoryListProps {
  categories: Category[];
  eventId: string;
  eventName?: string;
  onDelete: (id: string) => void;
}

export function CategoryList({ categories, eventId, eventName, onDelete }: CategoryListProps) {
  const router = useRouter();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleShowQR = (category: Category) => {
    setSelectedCategory(category);
    setQrModalOpen(true);
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-600 mb-4">No categories yet</p>
        <p className="text-sm text-gray-500">
          Add a category to start organizing participants
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>QR Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.participantCount}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowQR(category)}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    View QR
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/dashboard/events/${eventId}/categories/${category.id}`
                        )
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newName = prompt("Enter new category name:", category.name);
                        if (newName && newName !== category.name) {
                          // This will be handled by parent component
                          console.log("Edit category:", category.id, newName);
                        }
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* QR Code Modal */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>QR Code for Check-in</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <QRCodeDisplay
              categoryId={selectedCategory.id}
              categoryName={selectedCategory.name}
              eventName={eventName}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
