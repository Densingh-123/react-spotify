import React from 'react';
import { IoClose, IoOptions } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { usePlayer } from '@/context/PlayerContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function EqualizerModal({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { eqBands, getEqGain, setEqGain } = usePlayer();

  if (!visible) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', paddingBottom: '40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="modal-handle" />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IoOptions size={24} color={colors.primary} />
            <h3 style={{ margin: 0, fontSize: 20, color: colors.text }}>Equalizer</h3>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ color: colors.textSecondary }}>
            <IoClose size={28} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', overflowX: 'auto' }}>
          {eqBands.map((freq, index) => {
            const label = freq >= 1000 ? `${freq / 1000}k` : freq.toString();
            return (
              <div key={freq} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minWidth: 40 }}>
                <div style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 700 }}>+{Math.round(getEqGain(index))}</div>
                
                <input 
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={getEqGain(index)}
                  onChange={(e) => setEqGain(index, parseFloat(e.target.value))}
                  style={{
                    appearance: 'none',
                    width: 140,
                    height: 4,
                    background: `${colors.textSecondary}44`,
                    borderRadius: 4,
                    outline: 'none',
                    transform: 'rotate(-90deg)',
                    margin: '70px -50px', // Hack to fit rotated range inputs nicely
                  }}
                  className="eq-slider"
                />

                <div style={{ fontSize: 12, color: colors.text, fontWeight: 600, marginTop: 12 }}>{label}</div>
              </div>
            );
          })}
        </div>
        
        <style>{`
          .eq-slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: ${colors.primary};
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
          }
        `}</style>
      </div>
    </div>
  );
}
