"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";

interface ParsedParticipant {
  email: string;
  fullName: string;
  schoolInstitution?: string;
}

interface FileUploadModalProps {
  categoryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

export function FileUploadModal({
  categoryId,
  open,
  onOpenChange,
  onImportComplete,
}: FileUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedParticipant[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".csv")) {
      toast.error("Please upload a CSV or Excel file");
      return;
    }

    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const parsed: ParsedParticipant[] = [];
        const newErrors: string[] = [];

        data.forEach((row, index) => {
          const email = row.email || row.Email || "";
          const fullName = row.full_name || row.fullName || row["Full Name"] || row.name || row.Name || "";
          const schoolInstitution = row.school_institution || row.schoolInstitution || row.school || row.School || "";

          if (!email) {
            newErrors.push(`Row ${index + 1}: Missing email`);
            return;
          }

          if (!fullName) {
            newErrors.push(`Row ${index + 1}: Missing full name`);
            return;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            newErrors.push(`Row ${index + 1}: Invalid email format (${email})`);
            return;
          }

          parsed.push({
            email: email.trim(),
            fullName: fullName.trim(),
            schoolInstitution: schoolInstitution?.trim() || undefined,
          });
        });

        setParsedData(parsed);
        setErrors(newErrors);

        if (parsed.length === 0) {
          toast.error("No valid data found in file");
        } else {
          toast.success(`Parsed ${parsed.length} participants`);
        }
      },
      error: (error) => {
        toast.error(`Failed to parse file: ${error.message}`);
      },
    });
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;

    setImporting(true);
    setProgress(0);

    try {
      const response = await fetch("/api/participants/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          participants: parsedData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to import participants");
      }

      const result = await response.json();
      
      setProgress(100);
      
      if (result.failed > 0) {
        toast.warning(
          `Imported ${result.success} participants. ${result.failed} failed.`,
          {
            description: result.errors.slice(0, 3).join(", "),
          }
        );
      } else {
        toast.success(`Successfully imported ${result.success} participants`);
      }

      onImportComplete();
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to import participants");
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setProgress(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Participants</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                {file ? (
                  <>
                    <FileSpreadsheet className="h-12 w-12 text-green-500" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {parsedData.length} participants found
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400" />
                    <p className="font-medium">Click to upload CSV or Excel file</p>
                    <p className="text-sm text-gray-600">
                      Required columns: email, full_name (or fullName)
                    </p>
                    <p className="text-sm text-gray-600">
                      Optional: school_institution (or school)
                    </p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Validation Errors</p>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    {errors.slice(0, 5).map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                    {errors.length > 5 && (
                      <li>• ... and {errors.length - 5} more errors</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {parsedData.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">
                Preview (showing first 10 of {parsedData.length})
              </h3>
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>School</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.slice(0, 10).map((participant, i) => (
                      <TableRow key={i}>
                        <TableCell>{participant.email}</TableCell>
                        <TableCell>{participant.fullName}</TableCell>
                        <TableCell>{participant.schoolInstitution || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Progress */}
          {importing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-gray-600">
                Importing participants...
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose} disabled={importing}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={parsedData.length === 0 || errors.length > 0 || importing}
            >
              {importing ? "Importing..." : `Import ${parsedData.length} Participants`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
