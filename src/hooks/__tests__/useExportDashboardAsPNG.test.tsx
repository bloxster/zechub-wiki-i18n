import { act, renderHook } from "@testing-library/react";
import html2canvas from "html2canvas";
import useExportDashboardAsPNG from "../useExportDashboardAsPNG";

jest.mock("html2canvas", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedHtml2canvas = html2canvas as jest.MockedFunction<typeof html2canvas>;

describe("useExportDashboardAsPNG", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    mockedHtml2canvas.mockReset();
  });

  it("renders the chart container and downloads it as a PNG", async () => {
    mockedHtml2canvas.mockResolvedValue({
      toDataURL: () => "data:image/png;base64,AAAA",
    } as unknown as HTMLCanvasElement);
    const click = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {});
    jest.spyOn(console, "log").mockImplementation(() => {});

    const { result } = renderHook(() => useExportDashboardAsPNG());
    const container = document.createElement("div");
    Object.defineProperty(result.current.divChartRef, "current", {
      value: container,
      writable: true,
    });

    await act(async () => {
      await result.current.handleSaveToPng("Sprout Supply");
    });

    expect(mockedHtml2canvas).toHaveBeenCalledWith(container, expect.any(Object));
    expect(click).toHaveBeenCalledTimes(1);
    const link = click.mock.contexts[0] as HTMLAnchorElement;
    expect(link.download).toBe("Sprout-Supply-zechub-chart.png");
    expect(link.href).toBe("data:image/png;base64,AAAA");
  });

  it("alerts and does nothing when there is no chart container", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useExportDashboardAsPNG());

    await act(async () => {
      await result.current.handleSaveToPng("Sprout Supply");
    });

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(mockedHtml2canvas).not.toHaveBeenCalled();
  });
});
