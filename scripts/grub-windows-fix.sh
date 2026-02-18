#!/bin/bash
# ================================================
# 🪟 GRUB WINDOWS 11 FIX — Dual Boot Manual Entry
# Executar quando os-prober não detecta o Windows
# (Fast Startup / Hibernação do Windows)
# ================================================
# Uso: sudo bash scripts/grub-windows-fix.sh

set -e

GRUB_CUSTOM="/etc/grub.d/40_custom"
WINDOWS_DISK="/dev/sda"
WINDOWS_PART="/dev/sda3"

echo "🔍 Detectando UUID do Windows..."
WIN_UUID=$(sudo blkid -s UUID -o value $WINDOWS_PART 2>/dev/null)

if [ -z "$WIN_UUID" ]; then
    echo "❌ Não foi possível detectar o UUID de $WINDOWS_PART"
    echo "   Verifique se o disco está conectado: lsblk"
    exit 1
fi

echo "✅ UUID Windows: $WIN_UUID"

# Verifica se já existe entrada manual
if grep -q "Windows" $GRUB_CUSTOM 2>/dev/null; then
    echo "⚠️  Entrada Windows já existe em $GRUB_CUSTOM. Pulando."
else
    echo "📝 Adicionando entrada manual do Windows 11 ao GRUB..."
    cat >> $GRUB_CUSTOM << EOF

# Windows 11 — Adicionado manualmente (os-prober bypass)
menuentry "🪟 Windows 11" --class windows --class os {
    insmod part_msdos
    insmod ntfs
    insmod chain
    set root=(hd0,msdos3)
    chainloader +1
}
EOF
    echo "✅ Entrada adicionada."
fi

echo "🔄 Regenerando GRUB..."
sudo update-grub

echo ""
echo "✅ CONCLUÍDO! No próximo boot você verá:"
echo "   [1] Ubuntu/Xubuntu (padrão, 5s)"
echo "   [2] 🪟 Windows 11"
echo ""
echo "⚠️  IMPORTANTE: Se o Windows não bootar, entre no Windows e execute:"
echo "   powercfg /h off   (desabilitar Fast Startup/Hibernação)"
echo "   Depois reinicie e tente novamente."
