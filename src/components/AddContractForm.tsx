import React, { useState } from 'react';
import { ArrowLeft, Save, X, FileText, Upload, Calendar } from 'lucide-react';
import { showSuccess, showConfirm } from '../utils/alerts';
import FileUpload from './FileUpload';

interface AddContractFormProps {
  onBack: () => void;
  onSave: (contractData: any) => void;
}

const AddContractForm: React.FC<AddContractFormProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    // Informasi Karyawan
    pilihKaryawan: '',
    departemen: '',
    posisiJabatan: '',
    atasanLangsung: '',
    
    // Detail Kontrak
    jenisKontrak: 'PKWT',
    tanggalMulai: '',
    tanggalBerakhir: '',
    durasiKontrak: '',
    periodeReview: '',
    
    // Kompensasi
    gajiPokok: '',
    tunjangan: '',
    uangMakan: '',
    uangTransport: '',
    
    // Dokumen
    templateKontrak: '',
    uploadDokumen: null as File | null,
    catatan: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto calculate duration when dates are selected
    if (name === 'tanggalMulai' || name === 'tanggalBerakhir') {
      if (formData.tanggalMulai && formData.tanggalBerakhir) {
        const startDate = new Date(name === 'tanggalMulai' ? value : formData.tanggalMulai);
        const endDate = new Date(name === 'tanggalBerakhir' ? value : formData.tanggalBerakhir);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        
        setFormData(prev => ({
          ...prev,
          durasiKontrak: `${months} bulan`
        }));
      }
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      uploadDokumen: file
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.pilihKaryawan) {
      newErrors.pilihKaryawan = 'Pilih karyawan wajib diisi';
    }

    if (!formData.departemen) {
      newErrors.departemen = 'Departemen wajib diisi';
    }

    if (!formData.posisiJabatan) {
      newErrors.posisiJabatan = 'Posisi/Jabatan wajib diisi';
    }

    if (!formData.tanggalMulai) {
      newErrors.tanggalMulai = 'Tanggal mulai wajib diisi';
    }

    if (!formData.tanggalBerakhir) {
      newErrors.tanggalBerakhir = 'Tanggal berakhir wajib diisi';
    }

    if (!formData.gajiPokok) {
      newErrors.gajiPokok = 'Gaji pokok wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      showSuccess('Kontrak berhasil disimpan!');
      onBack();
    }
  };

  const handleSaveDraft = () => {
    showSuccess('Draft kontrak berhasil disimpan!');
  };

  const handleCancel = async () => {
    const confirmed = await showConfirm('Apakah Anda yakin ingin membatalkan? Data yang sudah diisi akan hilang.');
    if (confirmed) {
      onBack();
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^\d]/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tambah Kontrak</h1>
              <p className="text-gray-600">Kontrak Kerja • Tambah Kontrak</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informasi Kontrak Baru */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Informasi Kontrak Baru</h2>
              
              {/* Informasi Karyawan */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-800 mb-4">Informasi Karyawan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pilih Karyawan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Karyawan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="pilihKaryawan"
                      value={formData.pilihKaryawan}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.pilihKaryawan ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Pilih karyawan</option>
                      <option value="Ahmad Fauzi">Ahmad Fauzi</option>
                      <option value="Siti Nurhaliza">Siti Nurhaliza</option>
                      <option value="Budi Santoso">Budi Santoso</option>
                      <option value="Dewi Lestari">Dewi Lestari</option>
                      <option value="Rudi Hermawan">Rudi Hermawan</option>
                    </select>
                    {errors.pilihKaryawan && (
                      <p className="text-red-500 text-sm mt-1">{errors.pilihKaryawan}</p>
                    )}
                  </div>

                  {/* Departemen */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departemen
                    </label>
                    <select
                      name="departemen"
                      value={formData.departemen}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.departemen ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Pilih departemen</option>
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="HR">Human Resource</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                    {errors.departemen && (
                      <p className="text-red-500 text-sm mt-1">{errors.departemen}</p>
                    )}
                  </div>

                  {/* Posisi/Jabatan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posisi/Jabatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="posisiJabatan"
                      value={formData.posisiJabatan}
                      onChange={handleInputChange}
                      placeholder="Masukkan posisi/jabatan"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.posisiJabatan ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.posisiJabatan && (
                      <p className="text-red-500 text-sm mt-1">{errors.posisiJabatan}</p>
                    )}
                  </div>

                  {/* Atasan Langsung */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Atasan Langsung
                    </label>
                    <input
                      type="text"
                      name="atasanLangsung"
                      value={formData.atasanLangsung}
                      onChange={handleInputChange}
                      placeholder="Masukkan Atasan karyawan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Detail Kontrak */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-800 mb-4">Detail Kontrak</h3>
                
                {/* Jenis Kontrak */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kontrak <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="jenisKontrak"
                        value="PKWT"
                        checked={formData.jenisKontrak === 'PKWT'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      PKWT (Kontrak)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="jenisKontrak"
                        value="PKWTT"
                        checked={formData.jenisKontrak === 'PKWTT'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      PKWTT (Tetap)
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tanggal Mulai */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggalMulai"
                      value={formData.tanggalMulai}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.tanggalMulai ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.tanggalMulai && (
                      <p className="text-red-500 text-sm mt-1">{errors.tanggalMulai}</p>
                    )}
                  </div>

                  {/* Tanggal Berakhir */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Berakhir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggalBerakhir"
                      value={formData.tanggalBerakhir}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.tanggalBerakhir ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.tanggalBerakhir && (
                      <p className="text-red-500 text-sm mt-1">{errors.tanggalBerakhir}</p>
                    )}
                  </div>

                  {/* Durasi Kontrak */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi Kontrak
                    </label>
                    <input
                      type="text"
                      name="durasiKontrak"
                      value={formData.durasiKontrak}
                      onChange={handleInputChange}
                      placeholder="12 bulan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                  </div>

                  {/* Periode Review */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Periode Review
                    </label>
                    <select
                      name="periodeReview"
                      value={formData.periodeReview}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih periode review</option>
                      <option value="3 bulan">3 bulan</option>
                      <option value="6 bulan">6 bulan</option>
                      <option value="12 bulan">12 bulan</option>
                    </select>
                  </div>

                  {/* Gaji Pokok */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gaji Pokok <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="text"
                        name="gajiPokok"
                        value={formatCurrency(formData.gajiPokok)}
                        onChange={handleCurrencyChange}
                        placeholder="0"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.gajiPokok ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.gajiPokok && (
                      <p className="text-red-500 text-sm mt-1">{errors.gajiPokok}</p>
                    )}
                  </div>

                  {/* Tunjangan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tunjangan
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="text"
                        name="tunjangan"
                        value={formatCurrency(formData.tunjangan)}
                        onChange={handleCurrencyChange}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Uang Makan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uang Makan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="text"
                        name="uangMakan"
                        value={formatCurrency(formData.uangMakan)}
                        onChange={handleCurrencyChange}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Uang Transport */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uang Transport
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="text"
                        name="uangTransport"
                        value={formatCurrency(formData.uangTransport)}
                        onChange={handleCurrencyChange}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dokumen Kontrak */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-800 mb-4">Dokumen Kontrak</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Template Kontrak */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Kontrak
                    </label>
                    <select
                      name="templateKontrak"
                      value={formData.templateKontrak}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih template</option>
                      <option value="Template PKWT Standard">Template PKWT Standard</option>
                      <option value="Template PKWTT Standard">Template PKWTT Standard</option>
                      <option value="Template Manager">Template Manager</option>
                      <option value="Template Internship">Template Internship</option>
                    </select>
                  </div>

                  {/* Upload Dokumen */}
                  <div>
                    <FileUpload
                      label="Upload Dokumen"
                      accept="application/pdf,.doc,.docx"
                      maxSize="5MB"
                      formats="PDF, DOC, DOCX"
                      onFileSelect={handleFileChange}
                      value={formData.uploadDokumen}
                    />
                  </div>
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleInputChange}
                  placeholder="Tambahkan catatan atau informasi tambahan tentang kontrak ini..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 bg-white rounded-xl shadow-lg p-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Simpan Draft
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Tambah Kontrak
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddContractForm;