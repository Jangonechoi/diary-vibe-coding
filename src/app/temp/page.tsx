"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { Button } from "@/commons/components/button";

export default function TempPage() {
  const { openModal, closeModal } = useModal();

  const openFirstModal = () => {
    openModal(
      <Modal
        variant="info"
        actions="dual"
        theme="light"
        title="첫 번째 모달"
        message="이것은 첫 번째 모달입니다. '두 번째 모달 열기'를 클릭하면 중첩 모달이 열립니다."
        confirmText="두 번째 모달 열기"
        cancelText="닫기"
        onConfirm={openSecondModal}
        onCancel={closeModal}
        onClose={closeModal}
      />
    );
  };

  const openSecondModal = () => {
    openModal(
      <Modal
        variant="info"
        actions="dual"
        theme="light"
        title="두 번째 모달"
        message="이것은 두 번째 모달입니다. 중첩 모달이 정상적으로 작동합니다. 세 번째 모달도 열 수 있습니다."
        confirmText="세 번째 모달 열기"
        cancelText="닫기"
        onConfirm={openThirdModal}
        onCancel={closeModal}
        onClose={closeModal}
      />
    );
  };

  const openThirdModal = () => {
    openModal(
      <Modal
        variant="danger"
        actions="single"
        theme="light"
        title="세 번째 모달"
        message="이것은 세 번째 모달입니다! 중첩 모달 스택이 완벽하게 작동합니다."
        confirmText="확인"
        onConfirm={closeModal}
        onClose={closeModal}
      />
    );
  };

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        중첩 모달 테스트 페이지
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          아래 버튼을 클릭하여 중첩 모달 기능을 테스트하세요.
        </p>

        <Button
          variant="primary"
          size="large"
          theme="light"
          onClick={openFirstModal}
        >
          첫 번째 모달 열기
        </Button>

        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            테스트 항목:
          </h2>
          <ul
            style={{
              listStyle: "disc",
              paddingLeft: "20px",
              lineHeight: "1.8",
            }}
          >
            <li>중첩 모달이 순차적으로 열리는지 확인</li>
            <li>각 모달의 backdrop이 독립적으로 쌓이는지 확인</li>
            <li>모달이 열려있을 때 body 스크롤이 제거되는지 확인</li>
            <li>모달을 닫으면 이전 모달로 돌아가는지 확인</li>
            <li>backdrop 클릭 시 최상위 모달만 닫히는지 확인</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
